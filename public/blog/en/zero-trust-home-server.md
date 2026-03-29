---
title: "Building a Zero-Trust Home Server for $200 — Full Record"
date: 2026-03-29
tags: [Infrastructure, Docker, Security, Cloudflare, Tailscale]
excerpt: "Built a home server on NUCBox 3 with Cloudflare Tunnel x Tailscale — zero open ports. Full design record covering 2-layer networking, auto-deploy, and backup."
---

# Building a Zero-Trust Home Server for $200 — Full Record

## What I Built

A home server running six Docker applications on a GMKtec NUCBox 3 (Celeron J4125, 8GB RAM, 128GB SSD). Hardware cost: roughly $200.

The key point: **zero open ports.**

- Public access: Cloudflare Tunnel (external traffic)
- Admin access: Tailscale (SSH, maintenance)

These two paths are completely separated. No port forwarding on the home router. UFW blocks all ports, and only SSH via Tailscale is allowed.

```
Internet -> Cloudflare Tunnel -> Docker containers (public apps)
Admin    -> Tailscale VPN    -> SSH -> Server management
```

## Why Zero-Trust

The biggest risk of a home server is external intrusion.

On cloud platforms, AWS security groups and VPCs protect the network layer. A home server doesn't have that. Instead, I created two walls: Cloudflare Tunnel to "publish without opening ports" and Tailscale to "allow management only through VPN."

The firewall (UFW) policy is dead simple:

- Default deny all inbound
- Allow outbound only
- Single exception: SSH via Tailscale VPN interface

SSH is locked down to the minimum:

- Root login disabled
- Password authentication disabled (public key only)
- Authentication attempt limit enforced
- Connection grace time shortened
- Allowed users restricted to the bare minimum

## 2-Layer Network Design

Docker networking is split into two layers as well.

```
Public network
  ├── Cloudflare Tunnel
  ├── Frontend apps (Next.js)
  ├── Backend APIs
  └── Monitoring tools

DB network
  ├── PostgreSQL
  └── Backend APIs (also on public network)
```

Public apps sit on the public network and are accessed via Cloudflare Tunnel. The database sits exclusively on the DB network — unreachable from the outside. Backend apps belong to both networks, receiving frontend requests and accessing the database.

## Container Security

Every container follows these security policies:

- **Read-only filesystem**: No writes inside the container
- **All Linux capabilities dropped**: Only required permissions explicitly granted
- **No privilege escalation**: Prevents runtime permission elevation
- **Temp directories in memory**: Avoids disk writes

Mounting `docker.sock` into containers is also prohibited. Doing so would let a container control all Docker containers on the host.

## Auto-Deploy with GitHub Actions

The deployment policy: "never build on the server."

```
Developer PC -> git push -> GitHub Actions
  -> Build Docker image -> Push to GHCR
  -> Connect to server via Tailscale -> SSH to pull image
  -> docker compose up -d
```

Images are built on GitHub Actions and stored in GHCR (GitHub Container Registry). The server just pulls images and starts containers. No need to install Node.js or Python on the server.

Rollback is trivial — just switch to the previous image tag and run compose up.

The Tailscale GitHub Action connects the GitHub Actions runner to the server over VPN. CI/CD pipelines can reach the server without any public ports.

## Backup

Backups run automatically via systemd timer at 03:15 UTC daily.

```
Backup targets:
  ├── configs-and-data.tgz (config files + data)
  └── PostgreSQL dumps
       ├── roles.sql (role definitions)
       └── Individual DB dumps (.dump format)

Retention:
  ├── Local: 14 days
  └── External disk: 30 days
```

PostgreSQL backups use `pg_dumpall --globals-only` for role definitions and individual `pg_dump` for each database. A restore script is also prepared.

## Monitoring

Uptime Kuma handles health checks for each application. A public status page is served via Cloudflare Tunnel.

I initially planned Prometheus + Grafana as well, but deferred it given the NUCBox 3's resources (8GB RAM). Uptime Kuma alone handles downtime detection and notifications well enough.

## Build Process

The entire build process is documented in a 105KB chat log from AI-assisted design sessions.

| Phase | Content |
|---|---|
| chat1 | Initial design, overall architecture |
| chat2 | Refinement, zero-port design |
| chat3 | Production files (compose, scripts, systemd) |
| chat4 | Dockerfile, SSH, UFW, setup scripts |
| chat5 | Healthcheck, rollback, backup, Uptime Kuma |

The design was iteratively refined through AI conversations, with infrastructure built up in stages from the initial design in chat1 through operational hardening in chat5.

Final file count: 114. Two setup scripts, four backup scripts, eight systemd units, and four GitHub Actions workflows.

## Reflections

A zero-trust home server, built on $200 worth of hardware.

**Zero open ports is the way.** Thanks to Cloudflare Tunnel, web apps are served without exposing the home IP address at all. DDoS protection is handled on Cloudflare's side.

**Separating admin access is essential.** Public and admin access should never share the same path. The Tailscale-only SSH design felt inconvenient at first, but the peace of mind it provides is incomparable once you're used to it.

**Don't build on the server.** Build images in CI/CD; the server just pulls. Keeps the server environment clean and makes rollback trivial. This approach pays off especially on resource-constrained small servers.

**Designing infrastructure with AI.** Shell scripts, Docker Compose, systemd units, GitHub Actions workflows — infrastructure code spans many formats, each with its own conventions. Tell the AI "I want UFW configured like this" or "I want a systemd timer for daily backups," and it produces convention-compliant code. The human can focus on architectural decisions.
