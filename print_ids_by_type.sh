 
 usage() {
    echo "
            $0 typeObj typeAff
        ex:
        $0 project list
        $0 client form
        $0 
    "
    exit 0

 }

 if (($#<2)); then usage; fi 
 typeObj=$1
 typeAff=$2

 file=src/app/compo/$typeObj/$typeObj-$typeAff/$typeObj-$typeAff.component.html
 
print_ids.sh $file 
