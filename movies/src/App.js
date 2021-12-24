import React from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import logo from './logo.svg';
import './App.css';

const movieArr = [];
let imageBaseUrl = null;
let targetURL = null;
const APIKEY = "cb8075e06e3457700a64f46720e566ec";

class App extends React.Component {

	constructor(props) {
      super(props);
  		this.state = {
        id : null,
  			title : null,
  			overview : null,
  			backdrop : null,
  			vote : null,
  			date : null
  		}

    }

  componentDidMount() {

    const thi_s = this;
		const configURL = "https://api.themoviedb.org/3/configuration?api_key=" + APIKEY;
		const apiURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + APIKEY + "&language=en-US&page=1";

    fetch(configURL).then(function(response){
			if ( response.status !== 200 ) {
				console.log("Oh no, my code, its broken: " + response.status);
				return;
			}
			response.json().then(function(data){
				imageBaseUrl = data.images.secure_base_url;
			});
		});

		fetch(apiURL, {
			method: "GET"
		}).then(function(response) {
			if ( response.status !== 200 ) {
				console.log("Oh no, my code, its broken: " + response.status);
				return;
			}
			response.json().then(function(data){
        console.log(data);
				for(var i = 0; i < data.results.length; i++) {
					movieArr.push({
            "MovieID" : data.results[i].id,
						"Title" : data.results[i].title,
						"Overview" : data.results[i].overview,
						"Backdrop" : imageBaseUrl +  "original" + data.results[i].backdrop_path,
						"Vote" : data.results[i].vote_average,
						"Date" : data.results[i].release_date
					});
				}
				thi_s.setState({
          id : movieArr[0]["MovieID"],
					title : movieArr[0]["Title"],
					overview : movieArr[0]["Overview"],
					backdrop : movieArr[0]["Backdrop"],
					vote : movieArr[0]["Vote"],
					date : movieArr[0]["Date"]
				});
				console.log(data);
			});
		}).catch(function(err){
			console.log("Fetch error: " + err);
		});

  }

  handleInputChange = e => {
	  e.preventDefault();

	}

	handleClick = e => {
		let movieid = e.target.getAttribute("data-id");
    let parentElem = document.getElementById("featureBG");
    let $this = this;

    parentElem.classList.add("hide");

		for(var i = 0; i < e.target.parentNode.childNodes.length; i++) {
			e.target.parentNode.childNodes[i].classList.remove("active");
		}

		e.target.classList.add("active")

    setTimeout(function() {
      $this.setState({
        id : movieArr[movieid]["MovieID"],
        title : movieArr[movieid]["Title"],
        overview : movieArr[movieid]["Overview"],
        backdrop : movieArr[movieid]["Backdrop"],
        vote : movieArr[movieid]["Vote"],
        date : movieArr[movieid]["Date"]
      });
    }, 200);

    setTimeout(function() {
      parentElem.classList.remove("hide");
    }, 500);

	  console.log("click" + movieid);
	}

	render() {

		let th_s = this;
		let movieItems = movieArr.slice(0,5).map(function(movieLink, i) {
			let cls = (i === 0) ? 'item active' : 'item';
			return <li onClick={th_s.handleClick} data-id={i} className={cls} key={i}>0{i + 1}</li>;
		});

		return (
			<div id="mainContainer">
				<nav className="navbar fixed-top navbar-expand-lg navbar-dark">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">Movie<strong>Chill</strong></a>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						</ul>
						<form className="d-flex" id="navForm">
							<input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
						</form>
						</div>
					</div>
				</nav>
				<FeaturedMoive movieid={this.state.id} title={this.state.title} content={this.state.overview} bg={this.state.backdrop} date={this.state.date} vote={this.state.vote} />
				<div id="featureNav">
					<ul>{movieItems}</ul>
				</div>
			</div>
		);

	}

}

class FeaturedMoive extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
          winWidth : 0,
          winHeight : 0
        }
	}

	componentDidMount() {
    let featuredMovie = document.getElementById("featuredMovie");
    featuredMovie.style.height = window.innerHeight + "px";
    window.addEventListener('resize', this.updateHeight);
	}

  updateHeight = () => {
    let featuredMovie = document.getElementById("featuredMovie");
    this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
    featuredMovie.style.height = this.state.winHeight + "px";
    console.log(window.innerHeight);
  }

  getStars() {
    let round = Math.floor(this.props.vote) + 1;
    let starArr = [];
    for(var i = 0; i < round; i++) {
      starArr.push(<i key={i} className="fas fa-star"></i>);
    }
    return starArr;
  }

  handleClick = e => {
    e.preventDefault();
		let movieid = e.target.getAttribute("data-movieid");
    let movieDataURL = "https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + APIKEY + "&language=en-US&page=1";

    fetch(movieDataURL).then(function(response){
			if ( response.status !== 200 ) {
				console.log("Oh no, my code, its broken: " + response.status);
				return;
			}
			response.json().then(function(data){
				console.log(data);
			});
		});

    console.log(movieid);
  }

	render() {

		let divStyle = {
			background: 'url(' + this.props.bg + ') center top no-repeat'
		}

		console.log(movieArr);

		return(
			<div id="featuredMovie">
				<div id="featureBG" style={divStyle}></div>
				<div id="featuredDesc">
					<h1>{this.props.title}</h1>
          <ul className="list-group list-group-horizontal movieDetItems">
            <li className="list-group-item"><i className="far fa-clock"></i> {this.props.date}</li>
            <li className="list-group-item">{this.getStars()}</li>
          </ul>
					<p>{this.props.content}</p>
          <a href="#" onClick={this.handleClick} data-movieid={this.props.movieid} className="moreInfo addTransition">More Info</a>
				</div>
			</div>
		);
	}

}

export default App;
