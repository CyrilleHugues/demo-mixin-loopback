// Dependencies
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');
var should = chai.should();
chai.use(sinonChai);

// Loopback
var loopback = require('loopback');
var model = loopback.getModel('PersistedModel');

// Test
var sandbox;
var modelStub;
var remoteStub;
var findByIdStub;

var dueDate = require('../../common/mixins/due-date');

describe('Due date mixin', function(){
  beforeEach(function(){
    sandbox = sinon.sandbox.create();
    modelStub = sandbox.stub(model, 'defineProperty');
    remoteStub = sandbox.stub(model, 'remoteMethod');
    findByIdStub = sandbox.stub(model, 'findById');

    dueDate(model, {});
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('should add two parameters (duedate and stepdate)', function() {
    modelStub.should.have.been.calledWith('stepDate', {
      'type': 'date'
    });
    modelStub.should.have.been.calledWith('dueDate', {
      'type': 'date'
    });
  });

  it('should return dueDate of an item given its id', function() {
    model.nextDueDate(3, function() {
      findByIdStub.should.have.been.calledWith(
        3,
        {fields: {dueDate: true}},
        sinon.match.function
      );
    });
  });

  it('should export a remoteMethod to access due date of an item', function() {
    remoteStub.should.have.been.calledWithMatch('nextDueDate', {
      accepts: [{
        arg: 'id',
        type: 'number',
        required: true
      }],
      http: {
        verb: 'get',
        path: '/:id/next-due-date'
      }
    });
  });
});
