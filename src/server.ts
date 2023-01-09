import app from './app';

app.listen(process.env.PORT, () => {
  process.stdout.write(`Server has been started on port:${process.env.PORT}`);
});
