# /sync-poems

**Purpose**: Synchronize the poetry collection, update tags, and generate AI-powered analyses for new poems.

**What it does**:
1. Scans the `public/poems/` directory for all `.md` files
2. Extracts thematic tags from poem content using keyword analysis
3. Updates `public/poems/poems.json` with poem metadata and tags
4. Generates comprehensive AI analyses for any new poems
5. Checks for orphaned analyses (analyses without corresponding poems)

**When to use**: Run `/sync-poems` whenever you:
- Add new poems to the `poems/` directory
- Want to update tags based on poem content
- Need to generate detailed analyses for new poems

**Process**:
1. **Tag Extraction**: Analyzes poem content for themes like love, loss, mental-health, addiction, memory, identity, place, family, loneliness, hope, communication, time, growth, nature
2. **Analysis Generation**: For new poems, Claude will:
   - Read and interpret the poem's content
   - Identify central themes and emotional tone
   - Analyze literary devices and techniques
   - Provide line-by-line interpretation of key passages
   - Connect the poem to others in the collection
   - Generate a professional literary analysis
   - Note: Do NOT include creation dates in analyses
3. **Preservation**: Maintains any manually edited tags in existing poems.json
4. **Summary**: Provides a detailed report of all changes made

**Implementation**: When this command is run, Claude should:
1. Check for new poems in the `public/poems/` directory
2. Read each poem's content to extract appropriate tags
3. For any poems without analyses, generate a comprehensive analysis
4. Update poems.json with all poem metadata
5. Save analyses to the `public/analyses/` directory
6. Report on what was processed