/*globals Response */

module.exports = {
  successPromise: function(body, opts = {}) {
    return new Promise(resolve => resolve( new Response(body, opts) ));
  },

  createSuccessXHRmock(response, status = 200) {
    let MockXHR = function() {
      this.open = () => {};
      this.setRequestHeader = () => {};
      this.status = status;
      this.readyState = 4;
      this.response = new Response(response, { status: status});
      this.send = () => {
        this.onreadystatechange();
      };
    };

    return jest.fn(() => new MockXHR());
  },

  createErrorXHRmock(statusText, status = 500) {
    let MockXHR = function() {
      this.open = () => {};
      this.setRequestHeader = () => {};
      this.status = status;
      this.readyState = 4;
      this.statusText = statusText;
      this.send = () => {
        this.onreadystatechange();
      };
    };

    return jest.fn(() => new MockXHR());
  }
};
