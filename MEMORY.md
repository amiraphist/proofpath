# GraphOps Memory

The desktop preview renders the full GraphOps interface correctly with the dark Neon Glass Circuit styling, English-only labels, glass node cards, colored ports, pulse rails, mission panel, tool palette, and incident tape.

An initial mobile screenshot capture returned a white frame, but the browser page view subsequently showed the React root and complete interface with no console errors. This indicates a capture timing/preview snapshot issue rather than a confirmed runtime render failure. The live page content is present and responsive rules are in place for narrow viewports.

The current MVP uses CSS/SVG-native graph rendering and a small ambient canvas rather than raster art because built-in image generation was unavailable at the daily quota limit. No real payment APIs or credentials are used; all runs are deterministic simulations.
