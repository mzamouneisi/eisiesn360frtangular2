s="
                        {{ element.name }}
                    </td>
                    <td>
                        {{ element.description }}
                    </td>
                    <td>
                        {{ element.teamNumber }}p, 
                        {{ element.teamDesc }}
                    </td>
                    <td>
                        {{ element.method }}
                    </td>
                    <td>
                        {{ element.client?.name }}
"

echo "$s" | grep "element" | 
sed 's/ //g;s/.*{{//;s/}}.*//;s/\?//' | awk -F"." -v dq="\"" '
{
    if(tab[$2] == "") {go=1; tab[$2] = 1}
    else go = 0

    if(go == 1) {
        if(x=="") x = dq $2 dq 
        else x = x ", " dq $2 dq 
    }
}
END{
    print "this.colsSearch = [" x "]"
}
'