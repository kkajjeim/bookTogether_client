import React, { ReactElement } from "react";
import { Link } from "react-router-dom"
import { IReview, IReviewProps, IBook } from "./reviewInterface";
import { IRating } from "./../shared/Types"
import { fetchReviewLikes, fetchDeleteLikes, fetchBookRatings } from "./fetchReview"
import { connect } from "react-redux";
import "./Review.css";

export interface IProps {
  review: IReview;
  bookList: IBook[];
  user : any;
}

interface IState{
  likes: boolean;
  edit : boolean;
  likesNum : number;
  bookRating: IRating[];
}

class Review extends React.Component< IProps, IState> {
  constructor(props :any){
    super(props)
    this.state ={
      bookRating:[],
      edit : false,
      likes: false ,
      likesNum: this.props.review.likes.length,     
    }
    this.handleClickLikes = this.handleClickLikes.bind(this);
    this.handleDeleteLikes = this.handleDeleteLikes.bind(this)
  }

  public handleClickLikes(): void{
    const setStateLikesNum = (res: any): void => {
      return res
    };
    if(!this.state.likes){
      fetchReviewLikes(setStateLikesNum, this.props.review._id)
      this.setState({ likes : !this.state.likes})
      this.setState({ likesNum: this.state.likesNum +1 });
    }
  }

  public handleDeleteLikes(): void{
    const setStateLikesMinus = (res: any): void => {
      return res
    };
    if(this.state.likes){
      fetchDeleteLikes(setStateLikesMinus, this.props.review._id)
      this.setState({ likes : !this.state.likes})
      this.setState({ likesNum: this.state.likesNum -1 });
    }
  }

  public componentDidMount(): void {
    const setStateRating = (res: any): void => {
      this.setState({ bookRating: res });
    };
    const bookId: any = this.props.bookList.map((info :IBook) =>{
      return info._id
    })
    fetchBookRatings(setStateRating, bookId[0]); 
  }
  
  public componentDidUpdate(prevProps: any): void {
    console.log(1,this.props.review.author._id, 2,this.props.user._id, this.state.edit)
    if (this.props.user._id !== prevProps.user._id) {
      if(this.props.user._id === this.props.review.author._id){
        this.setState({edit:true})
      }
      if(this.props.review.likes.includes(this.props.user._id)){
        this.setState({likes: true})
      }  
    }
    if (this.props.review !== prevProps.review){
      if(this.props.user._id === this.props.review.author._id){
        this.setState({edit:true})
      }
    }
    if(this.props.review.likes !== prevProps.review.likes){
      this.setState({likesNum: this.props.review.likes.length})
      if(this.props.review.likes.includes(this.props.user._id)){
        this.setState({likes: true})
      }
    }
    if(this.props.bookList !== prevProps.bookList){
      const setStateRating = (res: any): void => {
        this.setState({ bookRating: res });
      };
      const bookId: any = this.props.bookList.map((info :IBook) =>{
        return info._id
      })
      fetchBookRatings(setStateRating, bookId[0]);
    }
  }
  
  public render(): ReactElement {
    const { bookList, review } = this.props
    const bookTitle: JSX.Element[] = bookList.map((info: IBook) => {
      return (
        <div key ={info._id}>
          <b>
            책 : {info.title} : 평점 
            {this.state.bookRating.length ? this.state.bookRating[0].avg_rating : 0}
          </b>
        </div>
      );
    });
    const style: any = {
      backgroundColor : review.thumbnail
    }

    
    return (
      <div className="review-area">
        <div className="review-cover" style ={style}>
          <div className="title-area" >
            <h1 className="title">{review.title}</h1>
            <div className="review-likes">
              {this.state.likes ?
              <span 
                uk-icon="heart" 
                className="heartLike" 
                onClick = {this.handleDeleteLikes}
              ></span>
              : <span 
                  uk-icon="heart" 
                  onClick ={this.handleClickLikes}
                ></span>}
              <div>{this.state.likesNum}</div>
              {this.state.edit ? 
              <button><Link to={`/editReview/${review._id}`}>수정</Link></button> 
              : null }             
            </div>
          </div>
        </div>
        <div className="post-area">
          <div className="book-rating">{bookTitle}</div>
          <div
            dangerouslySetInnerHTML={{ __html: review.contents }}
            className="text-area"
          ></div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state: any): any {
  return {
    user: state.user.User
  };
}

export default connect(mapStateToProps,null)(Review);
