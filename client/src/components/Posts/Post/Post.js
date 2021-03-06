import React, {useState} from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import useStyles from "./styles";
import { deletePost, likePost } from "../../../actions/posts";
import { ThumbUpAltOutlined } from "@material-ui/icons";

function Post({ post, setCurrentId }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes,setLikes] = useState(post?.likes)

  const handleDelete = (id) => {
    dispatch(deletePost(id));
    setCurrentId(null);
  };

  const userId = user?.result?.googleId || user?.result?._id;

  const handleLike = async (id) => {
      dispatch(likePost(id));
      if(likes?.find((like) => like === userId)) {
        setLikes(likes.filter((id)=> id !== userId))
      } else {
        setLikes([...likes, userId])
      }
  }

  const Likes = () => {
    if (post?.likes?.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  const openPost = () => {
    history.push(`/posts/${post._id}`)
  }

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardMedia
          className={classes.media}
          image={post.selectedFile ? post.selectedFile : ""}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) &&
          <div className={classes.overlay2}>
            <Button
              style={{ color: "white" }}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id)
              }}
            >
              <MoreHorizIcon fontSize="medium" />
            </Button>
          </div>
        }
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">
            {post.tags.map((tag) => {
              return `#${tag} `
            })}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {post.title.length > 23 ? post.title.substring(0,23)+'...' : post.title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
            {post.message.length > 200 ? post.message.substring(0,200)+'...': post.message}
          </Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          onClick={() => handleLike(post._id)}
        >
          <Likes/>
        </Button>
        {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) &&
          <Button
            size="small"
            color="primary"
            className={classes.deleteIcon}
            onClick={() => handleDelete(post._id)}
          >
            <DeleteIcon fontSize="small" className={classes.deleteIconSvg} />
            Delete
          </Button>
        }
      </CardActions>
    </Card>
  );
}

export default Post;
