 
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
 
#   grep -v 'id="|[selectId]="' $file | sed 's/.* id="/id="/' | awk '{print NR ") " $1}'

  awk -v Q="'" -v DBQ='"' -v CL="[" -v CR="]" '
  {
    if( index($0, " id=" DBQ)>0 || index($0, "[selectId]=" DBQ)>0 ) {
        type="id"
        if( index($0, "selectId")>0 ) type = "selectId"
        sub(/^.*id="/, "") ; 
        sub(/^.*\[selectId\]="/, "") ; 
        gsub(/".*$/, "") ;
        gsub(/'\''/, "") ;
        print $0 " " type 
    }
  }
  ' $file 
