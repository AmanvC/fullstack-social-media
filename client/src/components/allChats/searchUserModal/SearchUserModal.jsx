import React, { useContext, useState } from "react";
import "./searchUserModal.scss";
import { MdClose } from "react-icons/md";
import { ChatContext } from "../../../context/chatContext";
import NoUserImage from "../../../assets/NoUserImage.png";
import { makeRequest } from "../../../axios";
import { toast } from "react-hot-toast";
import Img from "../../lazyLoadImage/Img";
import Spinner from "../../spinner/Spinner";

const SearchUserModal = ({ close, setAllChats }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResultLoading, setSearchResultLoading] = useState(false);
  const [searchedResult, setSearchedResult] = useState([]);

  const [loading, setLoading] = useState(false);

  const { setSelectedChat } = useContext(ChatContext);

  const handleSearchUser = async () => {
    try {
      if (searchInput.length < 1) {
        setSearchedResult([]);
        return;
      }
      setSearchResultLoading(true);
      const res = await makeRequest().get(
        `/profile/search/user?username=${searchInput}`
      );
      setSearchedResult(res?.data?.data);
      setSearchResultLoading(false);
    } catch (err) {
      setSearchResultLoading(false);
      toast.error("Something went wrong, cannot search for user!");
    }
  };

  const handleClick = async (user) => {
    try {
      setLoading(true);
      const res = await makeRequest().post("/chats/create-or-get", {
        userId: user._id,
      });
      setSelectedChat(res?.data?.data);
      setAllChats((prev) => [res?.data?.data, ...prev]);
      setLoading(false);
      close();
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="search-user-modal">
      <div className="search-user-container">
        <MdClose className="close" onClick={close} />
        <h1>Select friends to chat.</h1>
        <input
          type="text"
          placeholder="Search friends..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyUp={handleSearchUser}
          autoFocus
        />
        {searchedResult.length > 0 && (
          <div className="searched-results">
            {searchedResult?.map((user) => (
              <div
                key={user._id}
                onClick={() => handleClick(user)}
                className="searched-user-card"
              >
                <div className="image">
                  <Img src={user.profileImage || NoUserImage} />
                </div>
                <div className="user-details">
                  <p className="name">{user.firstName + " " + user.lastName}</p>
                  <small>{user.email}</small>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default SearchUserModal;