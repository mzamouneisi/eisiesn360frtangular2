
usage() {
    echo "
        $0 force (0/1)
        ex: 
        $0 1
    "
    exit 
}

if (($#<1)); then usage; fi 

force=$1

if ((force==1)); then force="--legacy-peer-deps"; else force=""; fi 

ee() {
    cmd=$*
    echo "
    $cmd 
    "
    $cmd 
}

ee "rm -rf node_modules package-lock.json"
ee "npm cache clean --force"
ee "npm install $force"