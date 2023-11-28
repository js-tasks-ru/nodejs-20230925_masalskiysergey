const Validator = require('../Validator');
const { expect } = require('chai');
const { assert } = require('chai');

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('Валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('Валидатор проверяет строковые поля через assert', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      assert.lengthOf(errors, 1, 'Количество ошибок');
      assert.property(errors[0], 'field', 'Наличие поля "field"');
      assert.strictEqual(errors[0].field, 'name', `Наличие поля "name"`);
      assert.property(errors[0], 'error', 'Наличие поля "error"');
      assert.strictEqual(errors[0].error, 'too short, expect 10, got 6', 'Тестирование диапазона длины текста');
    });

    it('Валидатор проверяет цифровые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 55,
        },
      });

      const errors = validator.validate({ age: 17 });
      const errorsSecond = validator.validate({ age: 65 });
      const noErrors = validator.validate({ age: 25 });

      assert.lengthOf(errors, 1, 'Количество ошибок');
      assert.lengthOf(noErrors, 0, 'Количество ошибок');
      assert.property(errors[0], 'field', 'Наличие поля "field"');
      assert.strictEqual(errors[0].field, 'age', 'Наличие поля "age"');
      assert.property(errors[0], 'error', 'Наличие поля "error"');
      assert.strictEqual(errors[0].error, `too little, expect 18, got 17`, 'Проверка заданного диапазона числа');
      assert.strictEqual(errorsSecond[0].error, `too big, expect 55, got 65`, 'Проверка заданного диапазона числа');
    });

    it('Валидатор проверяет строковые и цифровые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 10,
        },
        age: {
          type: 'number',
          min: 7,
          max: 18,
        },
      });

      const petr = {
        name: 'Petr',
        age: 25,
      };

      const ivan = {
        name: 'I',
        age: 15,
      };

      const bob = {
        name: 'B',
        age: '5',
      };

      const alice = {
        name: 'Alice',
        age: '15',
      };

      const valentin = {
        name: 'Valentin',
        age: 14,
      };

      const errorData = {
        name: 111,
        age: 13,
      };

      const errorsNumber = validator.validate(petr);
      const errorsString = validator.validate(ivan);
      const errors = validator.validate(bob);
      const typeErrors = validator.validate(alice);
      const noErrors = validator.validate(valentin);
      const errorName = validator.validate(errorData);

      assert.lengthOf(errorsNumber, 1, 'Количество ошибок');
      assert.lengthOf(errorsString, 1, 'Количество ошибок');
      assert.lengthOf(errors, 2, 'Количество ошибок');
      assert.lengthOf(typeErrors, 1, 'Количество ошибок');
      assert.lengthOf(noErrors, 0, 'Количество ошибок');
      assert.lengthOf(errorName, 1, 'Количество ошибок');
      assert.strictEqual(errorsNumber[0].error, `too big, expect 18, got 25`, 'Проверка заданного диапазона числа');
      assert.strictEqual(errorsString[0].error, `too short, expect 2, got 1`, 'Проверка заданного диапазона числа');
      assert.strictEqual(typeErrors[0].error, `expect number, got string`, 'Проверка типа данных');
      assert.strictEqual(errors[0].error, `too short, expect 2, got 1`, 'Проверка типа данных');
      assert.strictEqual(errors[1].error, `expect number, got string`, 'Проверка типа данных');
      assert.strictEqual(errorName[0].error, `expect string, got number`, 'Проверка типа данных');
    });

    it('Валидатор проверяет отсутстие поля', () => {
      const validator = new Validator({
        stringField: {
          type: 'string',
          min: 1,
          max: 25,
        },
        numberField: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const dontHaveName = {
        numberField: 15,
      };

      const dontHaveNumber = {
        stringField: 'Hello World!',
      };

      const errorString = validator.validate(dontHaveName);
      const errorNumber = validator.validate(dontHaveNumber);

      assert.lengthOf(errorString, 1, 'Проверка количества ошибок');
      assert.lengthOf(errorNumber, 1, 'Проверка количества ошибок');
      assert.strictEqual(errorString[0].error, `expect field stringField: "string"`);
      assert.strictEqual(errorNumber[0].error, `expect field numberField: "number"`);
    });
  });
});
