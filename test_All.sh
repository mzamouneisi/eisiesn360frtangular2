for f in test_*_*.sh; do 
    echo "
    executing $f ...
    "
    sh $f 
done 

