LOG=$(basename $0 .sh).log 
echo "
    $LOG
"

date_deb=$(date_now.sh)
echo "$date_deb " > $LOG 
node  ./e2e/test-selinium/js/profils/test02-respEsn.js | tee -a $LOG 

echo "
    =================== LIST ERROR : =====================
" | tee -a $LOG 
grep -i "ERROR" $LOG | tee -a $LOG 
echo "====================================================" | tee -a $LOG 
date_fin=$(date_now.sh)
echo "
    date_deb : $date_deb
    date_fin : $date_fin
    LOG : $LOG 
" | tee -a $LOG 