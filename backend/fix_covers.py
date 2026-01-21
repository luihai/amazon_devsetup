
import json
import os
import requests
import time
from urllib.parse import quote

# Configuration
CONTENT_FILE = os.path.join(os.path.dirname(__file__), "../app/data/content.json")
GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q="

def load_content():
    if not os.path.exists(CONTENT_FILE):
        print(f"Error: {CONTENT_FILE} not found.")
        return None
    with open(CONTENT_FILE, 'r') as f:
        return json.load(f)

def save_content(data):
    with open(CONTENT_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Successfully saved updates to {CONTENT_FILE}")

def fetch_book_cover(title, author):
    """
    Fetches the thumbnail URL for a book using Google Books API.
    """
    query = f"intitle:{title}+inauthor:{author}"
    url = f"{GOOGLE_BOOKS_API_URL}{quote(query)}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if "items" in data and len(data["items"]) > 0:
                book_info = data["items"][0]["volumeInfo"]
                if "imageLinks" in book_info:
                    links = book_info["imageLinks"]
                    # Try to get the largest image possible
                    cover_url = (
                        links.get("extraLarge") or
                        links.get("large") or
                        links.get("medium") or
                        links.get("thumbnail") or
                        links.get("smallThumbnail")
                    )
                    
                    # Hack to get higher res if we only got a thumbnail
                    if cover_url and "&zoom=1" in cover_url:
                        # Try zoom=2 for better quality if it's a thumbnail
                        cover_url = cover_url.replace("&zoom=1", "&zoom=2")
                        # Also remove edge=curl which adds a page curl effect
                        cover_url = cover_url.replace("&edge=curl", "")
                        
                    return cover_url
    except Exception as e:
        print(f"Error fetching cover for {title}: {e}")
    
    return None

def main():
    print("Starting cover update process...")
    data = load_content()
    if not data:
        return

    updated_count = 0
    total_books = sum(len(niche.get("books", [])) for niche in data.get("niches", []))
    processed = 0

    for niche in data.get("niches", []):
        print(f"\nProcessing Niche: {niche.get('title')}")
        for book in niche.get("books", []):
            processed += 1
            title = book.get("title")
            author = book.get("author")
            current_image = book.get("image_url", "")
            
            print(f"[{processed}/{total_books}] Checking: {title} by {author}...")

            # Fetch new cover
            new_cover = fetch_book_cover(title, author)
            
            if new_cover:
                # Google Books image links are often http, upgrade to https
                if new_cover.startswith("http://"):
                    new_cover = new_cover.replace("http://", "https://")
                
                # Update if different (ignoring simple query param changes if base is same, but for now just update)
                if new_cover != current_image:
                    book["image_url"] = new_cover
                    updated_count += 1
                    print(f"  -> Updated cover!")
            else:
                print("  -> No cover found.")
            
            # Be nice to the API
            time.sleep(0.2)

    if updated_count > 0:
        save_content(data)
        print(f"\nDone! Updated {updated_count} book covers.")
    else:
        print("\nDone! No updates needed.")

if __name__ == "__main__":
    main()
