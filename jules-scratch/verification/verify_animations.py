import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the app
        page.goto("http://localhost:3000")

        # Wait for the first card to be visible
        expect(page.locator(".relative.w-full.h-64")).to_be_visible()

        # --- First Card: Array ---
        # Click the card to flip it
        page.locator(".relative.w-full.h-64").click()

        # Wait for the animation to be visible on the back
        back_of_card = page.locator(".absolute.w-full.h-full").nth(1)
        expect(back_of_card.locator(".text-4xl")).to_be_visible()

        # Take a screenshot of the first card's back
        page.screenshot(path="jules-scratch/verification/01_array_animation.png")

        # --- Second Card: Linked List ---
        # Click the "Known" button to go to the next card
        page.get_by_role("button", name="Known").click()

        # Click the second card to flip it
        page.locator(".relative.w-full.h-64").click()

        # Take a screenshot of the second card's back
        page.screenshot(path="jules-scratch/verification/02_linked_list_animation.png")

    finally:
        # Clean up
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
