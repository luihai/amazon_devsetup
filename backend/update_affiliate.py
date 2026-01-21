import json
import os

CONTENT_FILE = os.path.join(os.path.dirname(__file__), "../app/data/content.json")
OLD_TAG = "bibliophileai-20"
NEW_TAG = "busybibliophi-20"

def load_content():
    with open(CONTENT_FILE, 'r') as f:
        return json.load(f)

def save_content(data):
    with open(CONTENT_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Updated content saved to {CONTENT_FILE}")

def main():
    data = load_content()
    count = 0
    
    for niche in data.get("niches", []):
        for book in niche.get("books", []):
            link = book.get("amazon_link", "")
            if OLD_TAG in link:
                book["amazon_link"] = link.replace(OLD_TAG, NEW_TAG)
                count += 1
            elif "tag=" not in link:
                # Add tag if missing
                separator = "&" if "?" in link else "?"
                book["amazon_link"] = f"{link}{separator}tag={NEW_TAG}"
                count += 1
                
    print(f"Updated {count} links to use tag: {NEW_TAG}")
    save_content(data)

if __name__ == "__main__":
    main()
