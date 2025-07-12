#!/bin/bash
# Run this script to remove all readme files
find ./ -name "readme.*" -exec rm {}  \;
rm ./rmbloat.sh