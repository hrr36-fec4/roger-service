import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import path from 'path';
import $ from 'jquery';
import {
  faTimesCircle, faCheckCircle, faStar, faQuestionCircle, faStarHalfAlt,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import ReviewList from './components/review/ReviewList';
import ModalModel from './components/modal/ModalModel';
import RatingSnapshot from './components/nav/RatingSnapshot';
import Averages from './components/nav/Averages';
import ReviewIndex from './components/nav/ReviewIndex';
import SortSelector from './components/nav/SortSelector';
import ActiveFilters from './components/nav/ActiveFilters';


library.add(faTimesCircle);
library.add(faStar);
library.add(faCheckCircle);
library.add(faQuestionCircle);
library.add(faStarHalfAlt);

const SORT = {
  0: (a, b) => b.text.length - a.text.length,
  1: (a, b) => b.helpful - a.helpful,
  2: (a, b) => b.rating - a.rating,
  3: (a, b) => a.rating - b.rating,
  4: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      itemId: 1,
      selector: 0,
      filter: 0,
      showing: 8,
      helpful: [],
      flagged: [],
    };
    this.handleMore = this.handleMore.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.changeSort = this.changeSort.bind(this);
    this.fetch = this.fetch.bind(this);
    this.submit = this.submit.bind(this);
    this.patch = this.patch.bind(this);
  }

  componentWillMount() {
    this.fetch();
  }

  getAverageFit() {
    const classes = { ...this.state };
    const total = classes.reviews.reduce((res, review) => res + review.fit, 0);
    const count = classes.reviews.reduce((res, review) => (review.fit > 0 ? res + 1 : res), 0);
    let result = 0;
    if (count > 0 && total > 0) {
      result = Math.ceil((total / count) * 10) / 10;
    }
    return result;
  }

  setFilter(id) {
    this.setState({ filter: id, showing: 8 });
  }

  fetch(callback = () => {}) {
    const classes = { ...this.state };
    $.ajax({
      url: path.join('reviews', classes.itemId.toString()),
      type: 'GET',
      contentType: 'application/json',
      success: (results) => {
        this.setState({
          reviews: results,
          helpful: Array.from({ length: results.length }, () => false),
        }, callback());
      },
      error: err => console.log('.GET', err),
    });
  }

  patch(id, key) {
    const { helpful } = this.state;
    $.ajax({
      url: path.join('reviews', key, id),
      type: 'PATCH',
      contentType: 'application/json',
      success: () => {
        if (key !== 'flag') {
          this.fetch(this.setState({
            helpful: helpful.map((element, index) => (index === id ? true : element)),
          }));
        } else {
          this.fetch();
        }
      },
      error: err => console.log('Patch', err),
    });
  }

  submit(data, callback) {
    $.ajax({
      url: 'reviews',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: () => {
        callback();
        this.setState({ selector: 0 }, this.fetch());
      },
      error: err => console.log('POST', err),
    });
  }

  clearFilter() {
    this.setState({ filter: 0 });
  }

  handleMore() {
    this.setState(prevState => (
      { showing: prevState.showing + 8 }
    ));
  }

  filter() {
    const classes = { ...this.state };
    let result = classes.reviews;
    if (classes.filter > 0) {
      result = classes.reviews.filter(review => review.rating === classes.filter);
    }
    return result;
  }

  filteredTotal() {
    const classes = { ...this.state };
    let total = 0;
    if (classes.filter > 0) {
      total = classes.reviews.filter(review => review.rating === classes.filter).length;
    } else {
      total = classes.reviews.length;
    }
    return total;
  }

  changeSort(type) {
    const classes = { ...this.state };
    classes.reviews.sort(SORT[type]);
    this.setState({ selector: type, showing: 8 }, () => this.setState({
      helpful: Array.from({ length: classes.reviews.length }, () => false),
    }));
  }

  render() {
    const classes = { ...this.state };
    return (
      <div>
        <h1>HREI Reviews</h1>
        <ModalModel
          empty={classes.reviews.length === 0}
          itemId={classes.itemId}
          submit={this.submit}
        />
        <div className={classes.reviews.length === 0 ? 'hidden' : 'nav'}>
          <RatingSnapshot
            setFilter={this.setFilter}
            clearFilter={this.clearFilter}
            reviews={classes.reviews}
          />
          <Averages average={this.getAverageFit()} />
          <ReviewIndex total={this.filteredTotal()} showing={classes.showing} />
          <SortSelector changeSort={this.changeSort} selector={classes.selector} />
          <ActiveFilters star={classes.filter} clear={this.clearFilter} />
        </div>
        <ReviewList
          reviews={this.filter(classes.reviews).slice(0, classes.showing)}
          hasMore={classes.showing < this.filter(classes.reviews).length}
          handleMore={this.handleMore}
          patch={this.patch}
          helpful={classes.helpful}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
