import React from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [
        { _id: 1, Title: 'The Godfather', Description: 'An organized crime dynasty\'s aging patriarch transfers control of his clandestine empire to his reluctant son.', Genre: 'Crime', Director: 'Francis Ford Coppola', Stars: 'Marlon Brando, Al Pacino', ReleaseYear: '1972', Raating: '9.2', ImagePath: 'https://i.pinimg.com/originals/ed/ff/9c/edff9c9654e400a894303b4e34049b53.jpg' },
        { _id: 2, Title: 'Inception', Description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', Genre: 'Science fiction', Director: 'Christopher Nolan', Stars: 'Leonardo DiCaprio, Elliot Page', ReleaseYear: '2010', Rating: '8.8/10', ImagePath: 'https://www.themoviedb.org/t/p/w500/xymM5aW6MDcH5AR9I3CamSegJd6.jpg' },
        { _id: 3, Title: 'Angels & Demons', Description: 'Harvard symbologist Robert Langdon works with a nuclear physicist to solve a murder and prevent a terrorist act against the Vatican during one of the significant events within the church.', Genre: 'Thriller', Director: 'Ron Howard', Stars: 'Tom Hanks, Ewan McGregor', ReleaseYear: '2009', Rating: '6.7/10', ImagePath: 'https://m.media-amazon.com/images/I/51afYxsSc+L._AC_.jpg' }
      ]
    }
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }

  render() {
    const { movies, selectedMovie } = this.state;


    if (movies.length === 0) return <div className="main-view">The list is empty!</div>;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onMovieClick={(movie) => { this.setSelectedMovie(movie) }} />
          ))
        }
      </div>
    );
  }
}
export default MainView;