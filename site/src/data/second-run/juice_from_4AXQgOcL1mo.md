---
this_video_url: https://youtube.com/watch?v=4AXQgOcL1mo
this_video_id: 4AXQgOcL1mo
---
<think>
Okay, so I'm trying to understand how React's State hooks work, especially when it comes to mutating state by replacing old data with new data. From what I remember, in React, sometimes we need to update our state, but if that changes the data structure, we have to make sure it's immutable. That means instead of changing the actual data stored in React's memory, we can't mutate it directly because it would cause the component to re-render.

The example given was about adding a new user to State and updating an object representing users. The initial code looked something like this:

```javascript
const users = [];
function addUser(name) {
    const [newName, setNewName] = React.useState(name);
    React.use((state) => state(users.push(newName)));
}

addUser('John Doe');
```

So here, they're using React's use hook to get a new user and mutate the 'users' array by pushing it. But wait, if we push a new user into the users array, that changes the actual data in React's memory. So why is this considered mutating state?

Ah, I see! Because if you do `users.push(name)`, you're actually changing the underlying state of React's variables (like users). This means when the component renders, it's not just using the 'users' object but also has to re-render because React has to rebuild that data. That's why we don't want to mutate old data directly; instead, we need to create a new version.

So the correct way is to create a copy of the current state and replace it with the new data. That makes sense because otherwise, any changes to the original data would trigger re-renders, which isn't efficient or necessary if you're just updating something else in your component.

But why did the initial code go wrong? Because they were pushing into the 'users' array directly. React's state system can handle this change internally without triggering a re-render. So when the component is rendered again with the new data, it doesn't have to rebuild the entire UI; just that part where we're updating the users list.

Now, how do I create a copy of an object or array in JavaScript? The easiest way is using the spread operator (`=`). For example, if I have:

```javascript
const current = {a: 1, b: 2};
const newArray = current + [3, 4]; // newArray becomes [1, 2, 3, 4]
```

This creates a new array that includes all elements from the original plus any additional ones you spread. This way, we don't change the original data but just create a new object or array.

Similarly, for arrays, it's the same:

```javascript
const current = [1, 2];
current.push(3); // Now current is [1, 2, 3]
```

But using `=` doesn't copy references. So if I have an object and want a copy of its properties:

```javascript
const obj = {a: 1, b: 2};
const newObj = {} = obj; // newObj has same properties as obj
```

Or for arrays:

```javascript
const arr = [1, 2];
const newArray = {} = arr; // newArray is a new array with the same elements
```

This way, any mutations to the original object or array won't affect the copy. It's like making a deep copy.

So when using React's use hook, we can create a new state by spreading the current state. For objects:

```javascript
function addUser(name) {
    const [newName, setNewName] = React.useState(name);
    React.use((state) => state({ users: users, name: newName }));
}
```

Wait, no. Actually, we're replacing the entire 'users' object and adding a new property. But in the example given, they were using `push`, which is different because it's modifying the array.

So perhaps to create an immutable copy of the state, I should spread all properties or use an object literal for better readability.

For arrays:

```javascript
const current = [1, 2];
const newUsers = [...current]; // newUsers is [1, 2]
```

Or using spread operator:

```javascript
newUsers = { ...current };
```

This way, any changes to `current` won't affect `newUsers`, which is what we want.

Also, when using React's use hook, if I replace an existing state with a new object, the component should render correctly without needing to re-render. So in the example given, after replacing `users` with a new array that includes the new user name, the UI part where we update the users list will still work because it only uses this immutable copy.

I'm a bit confused about why the initial approach didn't work. Because if you just push into an object, React's state system handles it internally, so no re-rendering is needed. The real issue comes when you mutate old data in the state directly, which would trigger a re-render because React rebuilds that part of the UI each time.

So to summarize: When using React's use hook and assigning a new value to a state variable (like users), we should replace an immutable copy of that state with the new value. This way, any changes are applied through a component without affecting other parts of the UI. The spread operator or object spread operator can create this immutable copy efficiently.

Also, when working with arrays, using methods like `map` or spreading all properties explicitly ensures that mutations don't affect each other. For example:

```javascript
function updateName(name) {
    const [newName, setNewName] = React.useState(name);
    return React.use((state) => state({ 
        users: currentState.users.map(p => p.name === newName ? {} : p)
    }));
}
```

Wait, no. That's not correct. If we spread the entire object by name, it would spread all properties of the state. But if I want to create an immutable copy, perhaps spreading each property explicitly is better.

Alternatively:

```javascript
function updateName(name) {
    const [newName, setNewName] = React.useState(name);
    React.use((state) => state({ 
        users: { ...currentState.users }
    }));
}
```

This way, a new object is created with all properties from the current state, ensuring that any changes to `currentState.users` won't affect this copy.

I think it's crucial to understand how React's hooks work because they allow for efficient reactivity without unnecessary data reloads. It's easy to make a mistake by mutating old data directly, leading to unintended side effects or performance issues.

So, in the initial example, replacing `users` with an immutable copy of itself plus adding the new user name fixes the mutation issue. This ensures that when the component is rendered again, it uses this updated state without needing to re-render parts of the UI.
</think>

To address React's mutation of state by replacing old data directly, we can create an immutable copy of the state using the spread operator or spreading each property explicitly. Here's how:

**Step-by-Step Explanation:**

1. **Understand React's State Hooks:**
   - React's `useState` hook allows you to maintain state between component renders.
   - When you mutate data (e.g., push into an array), React typically rebuilds that part of the UI, leading to unintended side effects.

2. **Avoid Data Mutation:**
   - Directly mutating state variables in React hooks like `use` can cause unnecessary re-renders because it triggers a full state update.

3. **Immutable Copy with Spread Operator:**
   - Use the spread operator (`=`) or spreading each property explicitly to create an immutable copy of the current state.
   - This ensures that any changes only affect this copy, not the original data.

4. **Apply to Your Example:**

```javascript
function updateName(name) {
    const [newName, setNewName] = React.useState(name);
    React.use((state) => state({ users: { ...currentState.users } }));
}
```

5. **Explanation:**
   - `currentState.users` is the current state.
   - `{ ...currentState.users }` creates a new object with all properties from `currentState.users`, ensuring any mutations only affect this copy.

**Conclusion:**

By using an immutable copy of your state, you prevent unnecessary re-renders and ensure data mutability works as intended. This approach is efficient and avoids potential performance issues.
