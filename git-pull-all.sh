#!/bin/bash
# Pull changes from both origin and mirror remotes
# This script fetches from both remotes and merges changes intelligently

set -e

CURRENT_BRANCH=$(git branch --show-current)

echo "📥 Fetching from origin..."
git fetch origin

echo "📥 Fetching from mirror..."
git fetch mirror

# Check if branches exist in remotes
ORIGIN_EXISTS=$(git show-ref --verify --quiet refs/remotes/origin/$CURRENT_BRANCH && echo "yes" || echo "no")
MIRROR_EXISTS=$(git show-ref --verify --quiet refs/remotes/mirror/$CURRENT_BRANCH && echo "yes" || echo "no")

if [ "$ORIGIN_EXISTS" = "no" ] && [ "$MIRROR_EXISTS" = "no" ]; then
    echo "⚠️  Branch $CURRENT_BRANCH not found in any remote"
    exit 0
fi

# Get current commit
CURRENT_COMMIT=$(git rev-parse HEAD)

# Get remote commits
if [ "$ORIGIN_EXISTS" = "yes" ]; then
    ORIGIN_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)
else
    ORIGIN_COMMIT=""
fi

if [ "$MIRROR_EXISTS" = "yes" ]; then
    MIRROR_COMMIT=$(git rev-parse mirror/$CURRENT_BRANCH)
else
    MIRROR_COMMIT=""
fi

# Check if we're behind
BEHIND_ORIGIN=false
BEHIND_MIRROR=false

if [ -n "$ORIGIN_COMMIT" ] && [ "$CURRENT_COMMIT" != "$ORIGIN_COMMIT" ]; then
    if git merge-base --is-ancestor $CURRENT_COMMIT origin/$CURRENT_BRANCH 2>/dev/null; then
        BEHIND_ORIGIN=true
    fi
fi

if [ -n "$MIRROR_COMMIT" ] && [ "$CURRENT_COMMIT" != "$MIRROR_COMMIT" ]; then
    if git merge-base --is-ancestor $CURRENT_COMMIT mirror/$CURRENT_BRANCH 2>/dev/null; then
        BEHIND_MIRROR=true
    fi
fi

# Merge from origin first (primary source)
if [ "$BEHIND_ORIGIN" = "true" ] || [ -n "$ORIGIN_COMMIT" ] && [ "$CURRENT_COMMIT" != "$ORIGIN_COMMIT" ]; then
    echo "🔄 Merging changes from origin/$CURRENT_BRANCH..."
    if git merge origin/$CURRENT_BRANCH --no-edit 2>/dev/null; then
        echo "✅ Merged from origin"
    else
        echo "⚠️  Merge from origin had conflicts or was already up to date"
    fi
fi

# Then merge from mirror
if [ "$BEHIND_MIRROR" = "true" ] || [ -n "$MIRROR_COMMIT" ] && [ "$(git rev-parse HEAD)" != "$MIRROR_COMMIT" ]; then
    echo "🔄 Merging changes from mirror/$CURRENT_BRANCH..."
    if git merge mirror/$CURRENT_BRANCH --no-edit 2>/dev/null; then
        echo "✅ Merged from mirror"
    else
        echo "⚠️  Merge from mirror had conflicts or was already up to date"
    fi
fi

echo "✅ Pull from all remotes completed!"

