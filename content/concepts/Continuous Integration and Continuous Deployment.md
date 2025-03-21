---
aliases:
  - CD
  - CI
  - CI/CD
---
[[BitBucket]]
[[Nx]]
[[GitKraken]]

https://youtu.be/NcU0oEk6z8Y?si=jlehpNLVdqz7tazp

[[Perplexity AI]] explains [[Continuous Integration and Continuous Deployment]] 
CI/CD stands for **Continuous Integration** and **Continuous Delivery/Deployment**, forming a workflow that automates software development processes, including building, testing, and deploying code. It is a core practice in DevOps, enabling teams to deliver high-quality software quickly and reliably.

### Key Components
1. **Continuous Integration (CI)**:
   - Developers frequently merge code changes into a shared repository.
   - Automated builds and tests are triggered to catch errors early, ensuring code quality and reducing conflicts[1][2][3].

2. **Continuous Delivery (CD)**:
   - Extends CI by automating the release of tested code to production-like environments.
   - Human approval is typically required before deploying to production[2][3].

3. **Continuous Deployment**:
   - Fully automates the deployment process, releasing code to production as soon as it passes all tests[2][4].

### Benefits
- **Automation**: Reduces manual intervention, minimizes errors, and speeds up releases.
- **Faster Feedback**: Quick identification of bugs ensures faster resolution.
- **Scalability**: Supports growing teams and complex projects efficiently.
- **Improved Quality**: Rigorous testing ensures stable and reliable software[1][3][4].

### Workflow Example
1. Code changes are committed to a version control system (e.g., Git).
2. Automated builds and tests run in the CI pipeline.
3. Successful builds move to the CD stage for deployment or staging.
4. Final deployment is either automated (continuous deployment) or manually approved (continuous delivery)[2][4]. 

CI/CD streamlines software development, enabling frequent, reliable updates while maintaining quality.

Sources
[1] What is CI/CD? - GitLab https://about.gitlab.com/topics/ci-cd/
[2] What is CI/CD? - GitHub https://github.com/resources/articles/devops/ci-cd
[3] CI/CD: Continuous Integration & Delivery Explained - Semaphore https://semaphoreci.com/cicd
[4] CI/CD Pipeline : Everything You Need To Know - Spacelift https://spacelift.io/blog/ci-cd-pipeline
[5] What Is CI/CD and How Does It Work? - Black Duck https://www.blackduck.com/glossary/what-is-cicd.html
[6] ELI5: What is CI/CD and Why do we need them? : r/devops - Reddit https://www.reddit.com/r/devops/comments/t5nufe/eli5_what_is_cicd_and_why_do_we_need_them/
