echo "

Historique Virements Mourad ZAMOUN -> Sid Ahmed Boukhezna

19/01/2025 : 20 000 : I3ana
27/01/2025 : 400 000 : Achats blocs et compo
14/02/2025 : 120 000 : credit oued souf et aides
14/02/2025 : 600 000 : soc naqa
12/03/2025 : 60 000 : P mars 
24/03/2025 : 500 000 : last fab slr 
09/04/2025 : 100 000 : lot 2 moussaoui 
" | awk -F: '
BEGIN {
	s=0
}
{
	if($2 != "") {
		x=$2
		gsub(/ /, "", x)
		s += x
	}
}
END {
print s
}
'
