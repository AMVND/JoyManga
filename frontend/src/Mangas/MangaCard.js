import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';

class MangaCard extends Component {
  state = {
    chapters: [],
    error: null,
  };

  componentDidMount() {
    this.fetchChapters();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.manga.id !== this.props.manga.id ||
      prevProps.language !== this.props.language
    ) {
      this.fetchChapters();
    }
  }

  async fetchChapters() {
    const { manga, language } = this.props;
    try {
      const response = await axios.get(`https://api.mangadex.org/manga/${manga.id}/feed`, {
        params: {
          'translatedLanguage[]': [language],
          limit: 3,
          'order[updatedAt]': 'desc',
        },
      });
      this.setState({ chapters: response.data.data, error: null });
    } catch (error) {
      console.error('Error fetching chapters:', error);
      this.setState({ error });
    }
  }

  getCoverUrl() {
    const { manga } = this.props;
    const coverRel = manga.relationships?.find(
      (rel) => rel.type === 'cover_art' && rel.attributes?.fileName
    );
    return coverRel
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`
      : 'https://via.placeholder.com/150';
  }

  render() {
    const { manga, language, stats } = this.props;
    const { chapters, error } = this.state;

    // Manga title
    const title =
      manga.attributes.title[language] ||
      manga.attributes.title.en ||
      'Unknown Title';

    // Stats: rating, follows, comments
    const ratingAvg = stats?.rating?.average || 'N/A';
    const follows = stats?.follows || 0;
    const commentsCount = stats?.comments?.repliesCount || 0;

    return (
      <Row xs={1} md={2} className="g-4" >
        <Col>
        <Card className="h-100 position-relative">
        <Link to={`/manga/${manga.id}?lang=${language}`}>
          <Card.Img
            src={this.getCoverUrl()}
            variant="top"
            alt={title}
            style={{ objectFit: 'cover', height: '240px' }}
          />
        </Link>
        <Card.Body className="card-body">
        <Card.Title className="text-truncate" title={title}>
            <Link
              to={`/manga/${manga.id}?lang=${language}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {title}
            </Link>
          </Card.Title>
          {/* Display rating, follows, comments */}
          <p className="mb-1">
            <strong>Rating:</strong> {ratingAvg}
          </p>
          <p className="mb-1">
            <strong>Follows:</strong> {follows}
          </p>
          <p className="mb-1">
            <strong>Comments:</strong> {commentsCount}
          </p>
          <ListGroup variant="flush">
          {error && <p className="text-danger">Error loading chapters.</p>}
          {chapters && chapters.length > 0 ? (
            <ul className="list-group list-group-flush">
              {chapters.map((chapter) => {
                const chapterTitle =
                  chapter.attributes.title?.[language] ||
                  chapter.attributes.title ||
                  (chapter.attributes.chapter
                    ? `Chapter ${chapter.attributes.chapter}`
                    : 'Oneshot');
                const updatedAt = chapter.attributes.updatedAt
                  ? new Date(chapter.attributes.updatedAt).toLocaleString()
                  : 'N/A';

                return (
                  <ListGroup.Item key={chapter.id} className="p-0 border-0">
                    <Link
                      to={`/chapter/${chapter.id}?lang=${language}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div>
                        <small>{chapterTitle}</small>
                        <small>Updated: {updatedAt}</small>
                      </div>
                    </Link>
                  </ListGroup.Item>
                );
              })}
            </ul>
          ) : (
            <p>No chapters found in {language}.</p>
          )}
          </ListGroup>
        </Card.Body>
        {/* Footer with views/likes icons */}
        <Card.Footer className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                {/* <BsEye /> {manga.views} */}
              </small>
              <small className="text-muted">
                {/* <BsHeart /> {likes} */}
              </small>
            </Card.Footer>
        </Card>
        </Col>
      </Row>
    );
  }
}

export default MangaCard;