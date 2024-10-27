/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  return (
    <section className="banner" id="home">
      <div className="overlay">
      <Container>
        <Row className="align-items-center text-center">
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <span className=" text-2xl mt-10">QUALITY EDUCATION FOR LEADERSHIP</span>
                  <h1 className=" text-5xl  mt-10 mb-10">ABCDEFGH SCHOOL</h1>
                  <p className="text-2xl mb-10">From School to the Community</p>
                  <div className="d-flex justify-content-center">
                      <button className="mx-auto" onClick={() => console.log('connect')}>
                        Lets Connect <ArrowRightCircle size={25} />
                      </button>
                    </div>                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      </div>
    </section>
  );
};
