# Ledger Nano Gen5 Color Picker QA

## Initial desktop interaction

The Ledger Nano Gen5 palette card added a device node successfully in Stage 01. The node became selected immediately, its four-button color picker appeared beneath the device, and the available controls exposed accessible names for Jet Black, Cherry Red, Matcha Green, and Glacier White. The node ports and close button remained visible. Selecting Cherry Red and Matcha Green updated the device treatment and surfaced a clear status message without hiding the picker or connection ports.

## Base-route replay

After a clean preview restart, Stage 01 began with an empty board and the AI Agent palette action added the first node successfully. Ledger Nano Gen5 and Send payment were then added, leaving the expected three-node base route ready to connect and run. AI Agent connected to the Ledger input as a blue pen line; both the Agent output and Ledger input correctly switched to occupied state. Ledger then connected to Send payment with the expected second blue pen line, and both of those ports entered their occupied state. Running the completed Stage 01 route produced a VERIFIED result with score 100, a visible three-star HARDENING / VERIFIED panel, and a matching trace event: “3★ VERIFIED: Safe baseline — the required trusted controls are in place.”

## Official color source

The Ledger Nano Gen5 product page lists the four color options as Jet Black, Cherry Red, Matcha Green, and Glacier White.

## Mobile QA note

The first mobile automation pass stopped before opening Nodes because it wrote an invalid intro session value. The intro helper only suppresses the cover when the session value is exactly `1`; the script has been corrected before re-running the touch test. The second pass added a selected Ledger node correctly, then toggled that selection off during an unnecessary programmatic click; the script now preserves an already-selected node before tapping a color.
