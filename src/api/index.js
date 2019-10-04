import { version } from "../../package.json";
import { Router } from "express";

export default ({ config, db }) => {
  let api = Router();

  api.get("/billingslab", (req, res) => {
    //find id in BillingSlab table and return the BillingSlab
    db.query("SELECT * from BillingSlab", (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "BillingSlab": response.rows });
      }
    });


  });


  // perhaps expose some API metadata at the root

  // api.get("/billingslab/:id", (req, res) => {
  //   //find id in BillingSlab table and return the BillingSlab

  //   if (req.body !== undefined) {
  //     db.query(`SELECT price*${req.body.qty} as estimation from BillingSlab where pid=${req.body.pid}`, (err, response) => {
  //       if (err) {
  //         console.log(err.stack);
  //       } else {
  //         console.log(response.rows);
  //         res.json({ "Estimation": response.rows });
  //       }
  //     })
  //   }
  //   else {
  //     db.query(`SELECT * from BillingSlab where id=${req.params.id}`, (err, response) => {
  //       if (err) {
  //         console.log(err.stack);
  //       } else {
  //         console.log(response.rows);
  //         res.json({ "BillingSlab": response.rows, });
  //       }
  //     })
  //   }
  // });
  api.get("/billingslab/:id", (req, res) => {
    //find id in BillingSlab table and return the BillingSlab

    db.query(`SELECT * from BillingSlab where id=${req.params.id}`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "BillingSlab": response.rows, });
      }
    })
  });

  api.get("/billingslabestimation/", (req, res) => {
    //find id in BillingSlab table and return the BillingSlab
    let arr = []

    db.query(`SELECT * from BillingSlab`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        req.body.forEach(element => {
          response.rows.forEach(item => {
            if (element.pid === item.pid) {
              arr.push(element.qty * item.price)
            }
          })
        });
        res.json({ "Estimation": arr });
      }
    })
  });

  api.post("/billingslab", (req, res) => {
    //take BillingSlab from req and insert into BillingSlab table
    const { id, pid, price, active } = req.body
    db.query(`insert into BillingSlab values(${id},${pid},${price},${active})`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ "status": "successfull", "response": response.rows });
      }
    });
  });

  api.put("/billingslab/:id", (req, res) => {
    //take BillingSlab id from path and find the id and BillingSlab

    const { pid, price, active } = req.body

    db.query(`update BillingSlab set pid=${pid} , price=${price} , active=${active} where id=${req.params.id}`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ version, status: "live", method: "put" });
      }
    });
  });


  api.delete("/billingslab/:id", (req, res) => {
    //take BillingSlab id from path and find the id and update flag
    const active = false
    db.query(`update BillingSlab set active=${active} where id=${req.params.id}`, (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ version, status: "live", method: "delete" });
      }
    })
  });
  return api;
};
