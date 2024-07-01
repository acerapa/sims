eval $(ssh-agent -s)

ssh-add ~/.ssh/id_rsa_acerapa

ssh-add -l

ssh -T git@github.com
