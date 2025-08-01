# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a poetry website that displays poems with their analyses. The site supports:
- Dynamic poem loading from markdown files
- Tag-based filtering
- Analysis viewing with a toggle interface
- Responsive design optimized for mobile and desktop

## Directory Structure

- `poems/` - Contains all poem markdown files
- `analyses/` - Contains analysis markdown files for each poem
- `poems/poems.json` - JSON file with poem metadata and tags

## Custom Commands

Custom commands for this project are defined in `.claude/commands/`:
- `/sync-poems` - Synchronize poetry collection with automatic tag extraction and AI analysis generation

## Key Files

- `index.html` - Main HTML structure with semantic markup
- `script.js` - Handles poem loading, filtering, and UI interactions
- `styles.css` - Responsive CSS with mobile-first design
- `poems/poems.json` - Auto-generated list of poems with tags

## Development Notes

- The site uses vanilla JavaScript with no framework dependencies
- CSS uses custom properties for consistent theming
- All poems are loaded dynamically from markdown files
- The tag system supports multiple tags per poem for filtering
- Analyses are loaded on-demand when toggled

## Tag System

Tags are automatically extracted from poem content based on thematic keywords. The system looks for:
- Multiple keyword matches (threshold: 2+) to assign a tag
- Special place detection for California location-based poems
- Preservation of manually edited tags when re-syncing

## Performance Considerations

- Poems list is prefetched for faster loading
- Individual poems and analyses are loaded on-demand
- Mobile-optimized with lazy loading of non-critical resources