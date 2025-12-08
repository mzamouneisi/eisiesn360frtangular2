 
 usage() {
    echo "
            $0 [port=90]
        ex:
        $0 
        $0 90
        $0 9999
    "
    exit 0

 }

 if [[ "$1" == "-h" || "$1" == "?" || "$1" == "--help" ]]; then usage; fi 
 port=${1:-90}

 dir=docs
 b=./build.sh

 echo "
  port=$port 
  dir=$dir
  b=$b
 "

  [ -f $b ] && {
    . $b 
  } || {
    echo "
      NOT FILE b : $b
    "
    exit 1
  }

  sleep 1

  [ -d $dir ] && {
    ./run_server_in_dir.sh $dir $port
  } || {
    echo "
      NOT DIR dir : $dir
    "
    exit 1
  }
 
