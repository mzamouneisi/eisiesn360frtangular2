 
 usage() {
    echo "
            $0 type
        ex:
        $0 project
        $0 client
    "
    exit 0

 }

 if (($#<1)); then usage; fi 
 type=$1

 file=src/app/compo/$type/$type-form/$type-form.component.html
 
gen_test_selenium_from_form.sh $file 
