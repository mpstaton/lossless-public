
https://youtu.be/x2WtHZciC74?si=83UenlwiIydbNr_j

### [[Perplexity AI]] explains [[Weak Pointers]]
A **weak pointer** is a type of smart pointer in programming that holds a non-owning reference to an object managed by a **shared pointer**. It does not increase the reference count of the object, meaning it does not extend the object's lifetime. Weak pointers are primarily used to break **circular dependencies** in memory management.

### How Weak Pointers Work
1. **Observation, Not Ownership**: A weak pointer observes an object without owning it. If all shared pointers to the object are destroyed, the object is deallocated, even if weak pointers still reference it[1][4].
2. **Accessing the Object**: Weak pointers use the `lock()` method to create a temporary shared pointer if the object still exists. If the object has been destroyed, `lock()` returns `nullptr`[1].
3. **Breaking Cycles**: In situations where objects reference each other (e.g., parent-child relationships), using shared pointers can cause memory leaks due to circular references. Replacing one reference with a weak pointer prevents this issue[3][4].

### Example (C++)
```cpp
#include <iostream>
#include <memory>

struct Team;
struct Player {
    std::weak_ptr<Team> team; // Weak reference to avoid circular dependency
    ~Player() { std::cout << "Player destructed.\n"; }
};

struct Team {
    std::shared_ptr<Player> player; // Shared ownership
    ~Team() { std::cout << "Team destructed.\n"; }
};

int main() {
    auto team = std::make_shared<Team>();
    auto player = std::make_shared<Player>();

    team->player = player;
    player->team = team; // Circular reference resolved with weak_ptr

    return 0; // Both objects are properly destructed
}
```

### Use Cases
- **Breaking Circular Dependencies**: Prevents memory leaks in systems with mutual references[3][4].
- **Caching**: Allows cached objects to be garbage collected when no longer needed[2][7].
- **Observer Pattern**: Avoids keeping observers alive unnecessarily[7].

Weak pointers ensure efficient memory management without interfering with an object's lifecycle.

Sources
[1] What is a C++ weak pointer and where is it used? smart pointers ... https://iamsorush.com/posts/weak-pointer-cpp/
[2] Weak Pointers in Go: Why They Matter Now - VictoriaMetrics https://victoriametrics.com/blog/go-weak-pointer/
[3] When is std::weak_ptr useful? - Stack Overflow https://stackoverflow.com/questions/12030650/when-is-stdweak-ptr-useful
[4] Learn Understanding Weak Pointers - Codefinity https://codefinity.com/courses/v2/092c3356-af08-47f3-85ac-5ea89160bbae/208e76f6-3c01-4c99-80bf-e8334af8eca6/278d4412-3756-4fb0-bd14-a0144585cd20
[5] weak_ptr and what's the difference between this and std::shared_ptr? https://www.reddit.com/r/cpp_questions/comments/qxe9p5/why_use_stdweak_ptr_and_whats_the_difference/
[6] How a weak_ptr might prevent full memory cleanup of managed object https://dev.to/fenbf/how-a-weakptr-might-prevent-full-memory-cleanup-of-managed-object-i0i
[7] Weak reference - Wikipedia https://en.wikipedia.org/wiki/Weak_reference
[8] Mastering Weak Pointers in C++: Essential Guide - StudyPlan.dev https://www.studyplan.dev/pro-cpp/weak-pointers
