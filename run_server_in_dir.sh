 
 usage() {
    echo "
            $0 dir port
        ex:
        $0 docs 90
    "
    exit 0

 }

 if [[ "$1" == "-h" || "$1" == "?" || "$1" == "--help" || $# -lt 2 ]]; then usage; fi 
 dir=$1
 port=$2

cmd="python -m http.server $port"
 echo "
   run server in : ...

   dir=$dir
   port=$port 

   cmd : $cmd 
 "

 [ -d $dir ] && {
    cd $dir 
    pwd 
    $cmd
 } || {
    echo "
      NOT DIR dir : $dir
    "
    exit 1
 }
 
