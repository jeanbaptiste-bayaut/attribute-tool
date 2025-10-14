# Réflechir une fois le check fait quoi faire de la base de produit?

# Regarder si le script de suppression des fichiers d upload fonctionne bien

# Rajouter un spinner ou barre de progression pendant l'upload des valeurs

rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/.ssh/key-serveur-jb-aws.pem" \
. ubuntu@ec2-13-60-20-16.eu-north-1.compute.amazonaws.com:~/app
