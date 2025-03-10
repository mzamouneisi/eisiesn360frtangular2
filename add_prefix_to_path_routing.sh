usage() {
    echo "
        $0 prefix
        ex:
        $0 esn360/
    "
    exit 1
}

if (($#<1)); then usage; fi 

prefix=$1

f=src/app/app-routing.module.ts

awk -v q="'" -v p=$prefix '{

    print 

    if ( index($0, "path:")>0 && index($0, "component:")>0 ) {
        L=$0
        gsub("path: " q, "path: " q p , L )
        print L   
    }
}' $f > $f.tmp 
mv $f.tmp $f 
