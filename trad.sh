
echo "{"

awk -F= '{ key=$1; val=$2; 

	print "\"" key "\":{"
	print "\t" "\"fr\": " "\"" val "\"," 
	print "\t" "\"en\": " "\"" val "\"," 
	print "},"

}' trad.prop

echo "}"
