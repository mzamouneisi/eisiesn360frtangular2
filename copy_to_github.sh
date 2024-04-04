#!/bin/sh

DIR_DEV=/cygdrive/d/dev
d1=$DIR_DEV/bitbucket/eisiesn360frtangular
d2=$DIR_DEV/github/eisiesn360frtangular2

files=("configs" "src")
exts=("md" "sh" "json" "txt" "js" "config" "xml" "prop" "cli")


date_deb=$(date_now.sh)

# replace space by _
cd $d1 
for f in *; do 
    g=$(echo "$f" | sed 's/ /_/g')
    [ "$f" != "$g" ] && {
        mv "$f" $g 
    }
done 


file_out=/tmp/copy_all.tmp.sh
echo > $file_out 
mycopy() {
    echo "$*" >> $file_out 
}


for f in ${files[@]}; do 
    # echo "copy $f "
    mycopy cp -dpr $f $d2/
done 

for ext in ${exts[@]}; do 
    # echo "copy *.$ext "
    mycopy cp -dpr *.$ext $d2/
done 

. $file_out 
rm -rf $file_out 

date_fin=$(date_now.sh)

echo "
    $0
    $date_deb
    $date_fin 
"