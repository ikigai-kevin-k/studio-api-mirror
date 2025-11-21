#!/bin/bash
# Sync script to push all branches and tags to mirror repository
# This script syncs the current repository to the mirror repository

set -e

echo "🔄 Starting mirror sync to ikigai-kevin-k/studio-api-mirror..."

# Check if mirror remote exists
if ! git remote get-url mirror > /dev/null 2>&1; then
    echo "❌ Error: Mirror remote not found. Please add it first:"
    echo "   git remote add mirror git@github.com:ikigai-kevin-k/studio-api-mirror.git"
    exit 1
fi

# Fetch latest changes from origin
echo "📥 Fetching latest changes from origin..."
git fetch origin

# Push all branches to mirror
echo "📤 Pushing all branches to mirror..."
git push --all mirror

# Push all tags to mirror
echo "🏷️  Pushing all tags to mirror..."
git push --tags mirror

echo "✅ Mirror sync completed successfully!"
echo "   Mirror repository: git@github.com:ikigai-kevin-k/studio-api-mirror.git"

