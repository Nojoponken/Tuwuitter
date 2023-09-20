import superagent from 'superagent';
import assert from 'assert';

let server;
let api = 'http://localhost:3000';

describe('basic tests', () => {

    it('check that the server responds to request', async () => {
        let response = await superagent
            .post(`localhost:${3000}/messages`)
            .send({message: 'magus'});
            // .end((err, res) => {
            //     if (err) done(err);
            //     done();
            // });
        assert.equal(response.status, 200);
    });

    /**
     * Makes sure that the server is shut down after running the tests.
     */
    
});
