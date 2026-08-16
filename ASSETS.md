# GraphOps Assets

**Art direction:** Neon Glass Circuit. Dark ink-blue command deck, translucent rounded node cards, semantic neon accents, crisp SVG pulse rails, subtle grid texture, and restrained glass bloom. English UI only.

## Generated Assets

A custom reference image and logo generation were attempted after entering the image-generation workflow, but the current daily generation quota was exhausted. No generated asset URL is used in the implementation.

## CSS/SVG-Native Asset Plan

The first version uses CSS gradients, pseudo-elements, SVG paths, semantic color tokens, and small inline icon geometry for the graph, because these are sharper and more responsive for a Telegram Mini App than raster art. The visual target is still represented in the UI through the graph canvas, pulse edges, glass node cards, incident tape, and dark atmospheric background.

## Asset Rules

Do not place large media files inside the project tree. If custom image generation becomes available later, add only lightweight branding or background assets under `/home/ubuntu/webdev-static-assets/`, upload them through the WebDev asset flow, and reference their returned lifecycle-safe URLs directly.
