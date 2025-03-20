---
date_created: 2025-03-20
date_modified: 2025-03-20
---

I hate it when I want to add a long message to a git commit and git launches nano.  I just never picked it up. Avoided even having to think about it, really. 

I also never pondered that I could change the default editor for commit messages. That is, until I realized my [[Tooling/AI-Toolkit/Explainers/AI Terminal Assistant|AI Terminal Assistant]], [[Tooling/AI-Toolkit/Generative AI/Code Generators/Warp|Warp]] is not just helpful but really really wise (and patient) and the hardcore command line skills that most wanna be app developers, me included, never bother to become hyperfluent in.  

```bash
which nvim
/opt/homebrew/bin/nvim
```

```bash
git commit
git rebase -i HEAD~3
git config --global --edit
```

Now, command's I am confident with:
Neovim will open instead of nano. You can edit your message, and then:
•  To save and exit: `:wq`
•  To exit without saving: `:q!`
•  To just save: `:w`

By the way...
### Just attach a file to as Git Commit by passing the path as an argument
```bash
git commit -F path/to/your/message.txt

# if you want to review or edit it before it goes out:
git commit -e -F path/to/your/message.txt

# alternately, use the pipe constructor
echo "Your commit message" | git commit -F -
```