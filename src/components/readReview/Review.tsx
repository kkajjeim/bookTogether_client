import React, { ReactElement } from "react";
import { IReview, IReviewProps, IBook } from "./reviewInterface";
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
}

class Review extends React.Component< IProps, IState> {
  constructor(props :any){
    super(props)
    this.state ={
      edit : false,
      likes: false  
    }
    this.onClickLike = this.onClickLike.bind(this)
  }
  public onClickLike(): void{
    this.setState({ likes : !this.state.likes})
  }

  public componentDidMount(){
    console.log(this.props.user)

  }
  public render(): ReactElement {
    const { bookList, review } = this.props
    const bookTitle: JSX.Element[] = bookList.map((info: IBook) => {
      return (
        <div key ={info._id}>
          <b>
            책 : {info.title} : 평점 {info.rating} 도{" "}
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
              <span uk-icon="heart" className="heartLike" onClick = {this.onClickLike}></span>
              : <span uk-icon="heart" className="heart" onClick ={this.onClickLike}></span>}
              <span>{review.likes.length}</span>
              {this.state.edit ? 
              <button>수정</button> 
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