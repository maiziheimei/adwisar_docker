for file in *.png; do convert $file -resize 1920x1080 resized/$file; done
