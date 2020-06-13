(function () {
  let restaurants;
  let searchQuery;
  const getData = () => {
    fetch('http://localhost:4000/restaurants')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
      })
      .catch(err => {
        restaurants = [];
      })
  }

  const setRestaurants = (items) => {
    restaurants = items;
    generateView(restaurants);
  }

  const getRestaurants = () => {
    return restaurants;
  }

  const compareValues = (key, order = 'asc') => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  // rating , ETA and name
  const sortBy = (event, order = 'asc') => {
    const query = event.target.value;
    const data = getRestaurants();
    const cloneRestaurants = [...data];
    cloneRestaurants.sort(compareValues(query));
    setRestaurants(cloneRestaurants);
  }

  // tags
  const filter = (event) => {
    const tag = event.target.value;
    const data = getRestaurants();
    const filteredData = data.filter(item => item['cuisine_type'].includes(tag));
    generateView(filteredData);
  }


  const search = (event) => {
    const searchStr = event.target.value?.toLowerCase();
    const data = getRestaurants();
    const filteredData = data.filter(item => item['name'].toLowerCase().includes(searchStr));
    generateView(filteredData)
  }

  const handleChange = (event) => {
    const fn = _.debounce(search, 500);
    fn(event);
  }

  const cardView = (item) => {
    const { name, photograph } = item;
    const keys = Object.keys(item);
    const props = _.filter(keys, (key) => key != 'id' && key !== 'name' && key !== 'photograph');
    const parentDiv = document.createElement('div');
    parentDiv.className = "card";
    const image = document.createElement('img');
    image.setAttribute('src', photograph);
    image.innerHTML = '<i class= "material-icons" >&#xe87d;</i>';
    const h3 = document.createElement('h3');
    h3.innerText = name;
    h3.className = "heading";
    parentDiv.appendChild(image);
    parentDiv.appendChild(h3);
    for (let i = 0; i < props.length; i++) {
      const childDiv = document.createElement('div');
      childDiv.className = "rowText";
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      span1.innerText = props[i] + ' : ';
      span1.className = "span";
      span2.innerText = item[props[i]];
      span2.className = "text"
      childDiv.appendChild(span1);
      childDiv.appendChild(span2);
      parentDiv.appendChild(childDiv);
    }
    return parentDiv
  }

  const generateView = (restaurants) => {
    if (document.getElementById('resList'))
      document.getElementById('resList').remove()
    const container = document.createElement('div');
    container.setAttribute('id', 'resList');
    container.className = "container";
    let card;
    for (let i = 0; i < restaurants.length; i++) {
      card = cardView(restaurants[i]);
      container.appendChild(card);
    }
    document.getElementById('wrapper').appendChild(container);
  }

  const parent = document.createElement('div');
  parent.className = "header";
  const input = document.createElement('input');
  // const labelForSearch = document.createElement('label');
  // labelForSearch.setAttribute('for', 'search');
  // labelForSearch.innerText = 'Search';
  // // labelForSearch.className = "label";
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'search');
  input.setAttribute('placeholder', 'Search...');
  input.className = "select_box";
  input.addEventListener('keyup', handleChange)
  parent.appendChild(input);
  // parent.appendChild(labelForSearch);

  const label = document.createElement('label');
  label.setAttribute('for', 'sort_by');
  label.innerText = 'Sort By';
  label.className = "label";
  parent.appendChild(label);
  const select = document.createElement('select');
  select.setAttribute('id', 'sort_by')
  select.addEventListener('change', sortBy);
  select.className = "select_box";
  const options = ['name', 'rating', 'ETA'];
  for (let i = 0; i < options.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', options[i]);
    option.innerText = options[i];
    select.appendChild(option);
  }
  parent.appendChild(select);

  const label1 = document.createElement('label');
  label1.setAttribute('for', 'filter_by_tag');
  label1.innerText = 'Filter';
  label1.className = "label";
  parent.appendChild(label1);
  const select1 = document.createElement('select');
  select1.setAttribute('id', 'filter_by_tag');
  select1.className = "select_box";
  select1.addEventListener('change', filter)
  const options1 = ['American', 'Pizza', 'Healthy', 'Mexican'];
  for (let i = 0; i < options1.length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', options1[i]);
    option.innerText = options1[i];
    select1.appendChild(option);
  }
  parent.appendChild(select1);
  const div = document.createElement('div');
  div.setAttribute('id', 'wrapper');
  document.body.appendChild(div);
  document.getElementById('wrapper').appendChild(parent);
  getData()
})();