 
 usage() {
    echo "
            $0 file
        ex:
        $0 src/app/compo/client/client-form/client-form.component.html
    "
    exit 0

 }

 if (($#<1)); then usage; fi 
 file=$1

 echo "
   file : $file
 "
 
 print_ids.sh $file | awk -v DBQ='"' -v Q="'" '{
    id=$1
    type=$2
    val = "my_" id
    
    s = "await driver.findElement(By.id(" Q id Q ")).sendKeys(" DBQ val DBQ ");"
    if(type == "selectId") {
      s = "await utils.selectInListOptions(driver," DBQ id DBQ ", " DBQ val DBQ ");"
    }

    print s 

    }'
