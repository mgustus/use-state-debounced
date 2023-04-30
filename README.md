# use-state-debounced
Simple yet powerful solution for debounced state in react. This hook is based on the standard react hook *useState*. **useStateDebounced** provides the same functionality as *useState*. It returns the same array of [value, setValue] plus debounced value. 

## Installation
```bash
npm install use-state-debounced
```
## Usage
Usually we need debounced state to delay some costly operation execution until user interaction finished. In this example we wait for the user to finish typing in the search dialog before fetching a new list of recipes. So 700 ms after the last user's keystroke `debouncedTerm` is updated and the server query is executed. 

```javascript
import React, { useEffect, useState } from 'react';
import { useStateDebounced } from 'use-state-debounced';


export const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [term, debouncedTerm, setTerm] = useStateDebounced(700, 'pizza');

  useEffect(() => {
    const filteredList = await fetchRecepiesFromServer(debouncedTerm);
    setRecipes(filteredList);
  }, [debouncedTerm]);

  return (
    <>
      <input value={term} onChange={e => setTerm(e.target.value)} />

      <ul>
        {recipes.map((r) =>
          (<li key={r.id}>{r.name}</li>)
        )}
      </ul>
    </>
  );
};
```



In the above example we use `<input>` as a [controlled](https://reactjs.org/docs/forms.html#controlled-components) component. For [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) components the first `term` parameter can be omitted.

```javascript
const [, debouncedTerm, setTerm] = useStateDebounced(700, 'pizza');

<input onChange={e => setTerm(e.target.value)} />
```

Related article [here](https://dev.to/mgustus/usestatedebounced-debounced-state-in-react-3nc0).