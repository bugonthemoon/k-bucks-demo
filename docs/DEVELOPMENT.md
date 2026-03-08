# Development Guide

This document explains how to work on the K‑Bucks demo locally.

## Running the demo locally

Install dependencies:

    npm install

Start the development server:

    npm run dev

This launches the Vite development server and opens:

    http://localhost:5173

The browser will automatically reload when files change.

## Creating a release

A new demo version can be created with:

    npm run release -- VERSION "CHANGELOG MESSAGE"

Example:

    npm run release -- 0.2.95 "Update demo UI and telemetry behavior"

The release script performs the following actions:

- Updates window.KB_BUILD_VERSION in index.html
- Updates fallback version references
- Inserts a new entry into CHANGELOG.md
- Creates a git commit
- Creates a git tag for the version

## Key files

index.html  
Main application file containing the demo UI, game logic, and incentive engine.

CHANGELOG.md  
Version history for the demo.

CLAUDE.md  
Rules used by AI coding assistants when editing the project.

scripts/release.js  
Automation script used to create new demo versions.

vite.config.js  
Configuration for the development server.

## Editing rules

index.html is a large file and should be edited carefully.

Guidelines:

- Modify the smallest possible section of code.
- Avoid large refactors unless explicitly planned.
- Preserve indentation, formatting, and structure.
- Verify UI layout after any change.

## Local Git workflow

Typical development workflow:

Check repository status:

    git status

Stage changes:

    git add .

Commit changes:

    git commit -m "Describe the change"

View commit history:

    git log --oneline

The project can be developed entirely with a local Git repository.
