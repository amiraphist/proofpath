# Ledger Color Asset Notes

The supplied Glacier White SVG is a real direct device asset with a white/silver body treatment. The supplied Matcha Green SVG is a direct device asset with an intrinsic green shell; it is not a CSS recolor. Both assets share the same 928×1367 viewBox and device structure, so they can swap in the existing Ledger node without moving ports or changing dimensions.

The supplied Cherry Red SVG uses the same device dimensions and has an intrinsic red shell. In desktop verification, selecting a newly-added Ledger node opened only a compact, glass-like row of four circular swatches directly beneath the device; no extra color-card copy or controls were shown. Selecting Cherry Red, Matcha Green, and Glacier White changed the image source directly to their respective uploaded SVG assets, while the selected Ledger node, its ports, and the compact palette all remained visible.

The picker placement was corrected after user feedback: the Ledger node itself now contains no palette or popup. When a Ledger node is selected, the four-color glass dropdown appears beneath the Ledger entry in the Pencil Case instead, so dragging the device moves only the device.

Final interaction review: a real desktop CDP drag moved the Ledger node without moving any color control; a separate click reopened a four-swatch dropdown in the Pencil Case. In the 390×844 mobile view, the same dropdown appeared in the mobile Nodes sheet directly beneath the Ledger row, with all four swatches visible as one compact strip and no popup attached to the device.
