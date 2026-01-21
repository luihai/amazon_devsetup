import json
import os
import random
import datetime
import argparse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
CONTENT_FILE = os.path.join(os.path.dirname(__file__), "../app/data/content.json")

# Mock Data for fallback
MOCK_BOOKS = [
    {
        "title": "The Innovators",
        "author": "Walter Isaacson",
        "description": "A riveting history of the digital revolution.",
        "image_url": "https://m.media-amazon.com/images/I/81p2zWd0+YL._AC_UF1000,1000_QL80_.jpg",
        "amazon_link": "https://amazon.com/dp/147670869X?tag=bibliophileai-20"
    },
    {
        "title": "Superintelligence",
        "author": "Nick Bostrom",
        "description": "Paths, Dangers, Strategies. Essential for thinking about AI safety.",
        "image_url": "https://m.media-amazon.com/images/I/7106J1U1CaL._AC_UF1000,1000_QL80_.jpg",
        "amazon_link": "https://amazon.com/dp/0199678111?tag=bibliophileai-20"
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "description": "A handbook of agile software craftsmanship. A classic for a reason.",
        "image_url": "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UF1000,1000_QL80_.jpg",
        "amazon_link": "https://amazon.com/dp/0132350882?tag=bibliophileai-20"
    }
]

def load_content():
    if not os.path.exists(CONTENT_FILE):
        return {"niches": [], "last_updated": ""}
    with open(CONTENT_FILE, 'r') as f:
        return json.load(f)

def save_content(data):
    data["last_updated"] = datetime.datetime.now().isoformat()
    with open(CONTENT_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Content saved to {CONTENT_FILE}")

def get_openai_client():
    try:
        from openai import OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        return OpenAI(api_key=api_key)
    except ImportError:
        return None

def generate_niche_content(niche, client=None):
    print(f"Generating content for niche: {niche['title']}...")
    
    if client:
        try:
            print("Using OpenAI to generate unique recommendations...")
            prompt = f"""
            Recommend 3 distinct books for the niche: "{niche['title']}".
            The audience is: {niche['description']}.
            
            IMPORTANT: The user wants "offbeat" choices. 
            Select 1 fundamental classic and 2 "hidden gems" or "underrated" books that are surprisingly excellent but less famous.
            Avoid the most obvious top-of-the-charts bestsellers.
            
            Return a JSON object with a key "books" containing a list of books in this format:
            {{
              "books": [
                  {{
                    "title": "Book Title",
                    "author": "Author Name",
                    "description": "A 2-sentence persuasive reason why this specific audience should read it.",
                    "image_url": "https://via.placeholder.com/300x450?text=Book+Cover",
                    "amazon_link": "https://amazon.com/s?k=BOOK+TITLE+AUTHOR&tag=busybibliophi-20"
                  }}
              ]
            }}
            """
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            # Handle potential wrapping in case model returns an object instead of list directly inside content
            # But we asked for JSON. Let's parse efficiently. 
            # Actually, let's just ask for a key 'books' to be safe.
            
            parsed_content = json.loads(content)
            print(f"DEBUG: OpenAI Response: {parsed_content}")
            if isinstance(parsed_content, list):
                return {**niche, "books": parsed_content}
            elif "books" in parsed_content:
                return {**niche, "books": parsed_content["books"]}
                
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"OpenAI generation failed: {e}. Falling back to mock data.")

    # Fallback to Mock Data
    print("Using Mock Data (No API Key found or generation failed).")
    selected_books = random.sample(MOCK_BOOKS, k=random.randint(1, 3))
    niche['books'] = selected_books
    return niche

def main():
    parser = argparse.ArgumentParser(description="BibliophileAI Content Generator")
    parser.add_argument("--dry-run", action="store_true", help="Don't save changes")
    parser.add_argument("--slug", type=str, help="Target specific niche slug")
    args = parser.parse_args()

    data = load_content()
    
    if not data.get("niches"):
        print("No niches found to process.")
        return

    client = get_openai_client()
    if not client:
        print("NOTICE: No OPENAI_API_KEY found in environment. Running in simulation mode.")

    # Select target niche
    target_niche = None
    if args.slug:
        target_niche = next((n for n in data["niches"] if n["slug"] == args.slug), None)
        if not target_niche:
            print(f"Error: Niche with slug '{args.slug}' not found.")
            return
    else:
        target_niche = random.choice(data["niches"])

    updated_niche = generate_niche_content(target_niche, client)
    
    for i, n in enumerate(data["niches"]):
        if n["slug"] == updated_niche["slug"]:
            data["niches"][i] = updated_niche
            break
            
    if not args.dry_run:
        save_content(data)
    else:
        print("Dry run: Content would have been saved.")

if __name__ == "__main__":
    main()
